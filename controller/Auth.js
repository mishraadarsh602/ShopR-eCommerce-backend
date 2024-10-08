const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
//signup
exports.createUser = async (req, res) => {
    //  TOdo : need to encrypt the password
    try {
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            const user = new User({ ...req.body, password: hashedPassword,salt });
            const doc = await user.save();
            //below is used to create a session while signup
            req.login(sanitizeUser(doc),  (err)=> {
                if(err){
                    res.status(400).json(err);
                }else{
                    const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() +  60*60*1000), //for one hour
                        httpOnly: true
                    }).status(201).json({id:doc.id,role:doc.role});

                }
            })
            // res.status(201).json(sanitizeUser(doc));

        });
    } catch (error) {
        res.status(400).json(error);
    }
}

//login
exports.loginUser = async (req, res) => {
    const user = req.user;
    res.cookie("jwt", req.user.token, {
        expires: new Date(Date.now() +  60*60*1000), //for one hour
        httpOnly: true
    })
    .status(201)
    .json({id:user.id,role:user.role});
}

exports.checkAuth = async (req, res) => {
    if(req.user){
        res.status(200).json(req.user);
    }else{
        res.sendStatus(401);
    }
}